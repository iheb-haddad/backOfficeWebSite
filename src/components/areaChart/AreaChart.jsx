"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Axios from "../../services/Axios"
import { useEffect, useState } from "react"
import useStore from "../../globalState/UseStore"
import { Label as Labell } from "../ui/label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { DatePickerWithRange } from "../ui/dateRange"
import { Button } from "../ui/Button"
import { toast } from "sonner"
import useAuth from "../../hooks/useAuth"

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-3))",
  }
}

export default function AreaChartCard() {
    const { auth } = useAuth()
    const [timeRange, setTimeRange] = React.useState("90d")
    const [data, setData] = React.useState([])
    const {userProjects , fetchUserProjects , subProjects , fetchSubProjects } = useStore();
    const [projectSelected, setProjectSelected] = useState('')
    const [subProjectSelected, setSubProjectSelected] = useState('')
    const [date, setDate] = useState({
        from: '',
        to: '',
      })
    const [filterReset, setFilterReset] = useState(false)

    React.useEffect(() => {
        const user = auth?.user?._id || '';
        Axios.get("/documentations/nbrConsultationPerDate/"+user,{
                params : {
                    idSubProject : '',
                    fromDate : '',
                    toDate : ''
                }
            }
        )
        .then((res) => {
            setData(res.data)
        })
        .catch((err) => {
            console.log(err);
        })
    }, [filterReset,auth?.user?._id])

    useEffect(() => {
        setSubProjectSelected('')
    },[projectSelected])

    const handleReset = () => {
        setFilterReset(!filterReset)
        setProjectSelected('')
        setSubProjectSelected('')
        setDate({
            from: '',
            to: '',
        })
    }

    const handleFilter = () => {
        if(date.from && !date.to){
            toast.error("Veuillez choisir une date de fin")
            return
        }
        if(!date.from && date.to){
            toast.error("Veuillez choisir une date de début")
            return
        } 
        if(projectSelected !== '' && subProjectSelected === ''){
            toast.error("Veuillez choisir un sous projet")
            return
        }
        Axios.get("/documentations/nbrConsultationPerDate/"+auth?.user?._id,{
            params : {
                idSubProject : subProjectSelected,
                fromDate : date.from,
                toDate : date.to
            }
        })
        .then((res) => {
            setData(res.data)
        })
        .catch((err) => {
            console.log(err);
        })
    }

  return (
    <div className="flex col-span-3 gap-8">
    <div className="relative pt-4 p-2 flex flex-col gap-4">
        <FontAwesomeIcon icon={faRotateRight} className="cursor-pointer absolute top-2 right-2" onClick={handleReset}/>
        <Labell className="text-sm">Projet</Labell>
        <Select value={projectSelected} onValueChange={setProjectSelected} className="w-10">
            <SelectTrigger
                className="ml-auto h-7 rounded-lg pl-2.5"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
            {userProjects.map((project,index) => {
              return (
                <SelectItem
                  key={index}
                  value={project._id}
                  className="rounded-lg [&_span]:flex"
                >
                    {project.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
            <Labell className="text-sm">Sous projet</Labell>
            <Select value={subProjectSelected} onValueChange={setSubProjectSelected}>
            <SelectTrigger
                className="ml-auto h-7 rounded-lg pl-2.5"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Select sub project" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
            {subProjects.filter((subProject) => subProject.idProject._id === projectSelected).map((subProject,index) => {
              return (
                <SelectItem
                  key={index}
                  value={subProject._id}
                  className="rounded-lg [&_span]:flex"
                >
                    {subProject.name}
                </SelectItem>
              )
            })}
            </SelectContent>
        </Select>
        <DatePickerWithRange date={date} setDate={setDate}/>
        <Button onClick={handleFilter}>Filtrer</Button>
    </div>
    <Card className='flex-1'>
      <CardHeader className="flex justify-center items-center gap-2 space-y-0 py-5 sm:flex-row">
          <CardTitle> Variation du nombre de consultation</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="nbrConsultation"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  )
}
