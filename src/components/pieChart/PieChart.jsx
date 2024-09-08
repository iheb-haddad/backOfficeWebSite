"use client"

import {useState , useMemo} from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import Axios from "../../services/Axios"
import { useEffect } from "react"
import  useAuth  from "../../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateRight } from "@fortawesome/free-solid-svg-icons"
import { DatePickerWithRange } from "../ui/dateRange"
import { Button } from "../ui/Button"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
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
import useStore from "../../globalState/UseStore"
import { Label as Labell } from "../ui/label"

export const description = "An interactive pie chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  }
}

export default function PieChartCard() {
  const { auth } = useAuth()
  const [data ,setData] = useState([])
  const [activeMonth, setActiveMonth] = useState("")
  const [date, setDate] = useState({
    from: '',
    to: '',
  })

  const {userProjects , fetchUserProjects , subProjects , fetchSubProjects } = useStore();
  const [projectSelected, setProjectSelected] = useState('')
  const [subProjectSelected, setSubProjectSelected] = useState('')
  const [filterReset, setFilterReset] = useState(false)

  useEffect(() => {
    const user = auth?.user?._id || '';
    Axios.get("/documentations/nbrConsultation/"+user,{
        params : {
            idSubProject : '',
            fromDate : '',
            toDate : ''
        }
    })
    .then((res) => {
        setData(res.data)
        res.data.length > 0 && setActiveMonth(res.data[0].title)
    })
    .catch((err) => {
        console.log(err);
    })
    fetchUserProjects(user)
    fetchSubProjects(user)
    }, [auth?.user?._id,filterReset])

  const id = "pie-interactive"

  const activeIndex = useMemo(
    () => data.findIndex((item) => item.title === activeMonth),
    [activeMonth]
  )

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
        Axios.get("/documentations/nbrConsultation/"+auth?.user?._id,{
            params : {
                idSubProject : subProjectSelected,
                fromDate : date.from,
                toDate : date.to
            }
        })
        .then((res) => {
            setData(res.data)
            res.data.length > 0 && setActiveMonth(res.data[0].title)
        })
        .catch((err) => {
            console.log(err);
        }
        )
    }

  return (
    <div className="flex col-span-3 gap-8">
    <div className="relative pt-4 p-2 flex flex-col gap-4">
        <FontAwesomeIcon icon={faRotateRight} className="cursor-pointer absolute top-2 right-2" onClick={handleReset}/>
        <Labell className="text-sm">Projet</Labell>
        <Select value={projectSelected} onValueChange={setProjectSelected} className="w-10">
            <SelectTrigger
                className="ml-auto h-7  rounded-lg pl-2.5"
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
    <Card data-chart={id} className="flex flex-col flex-1">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
            <CardTitle className='mr-2 text-sm'>Nombre de consultation par document</CardTitle>
            <Select value={activeMonth} onValueChange={setActiveMonth}>
            <SelectTrigger
                className="ml-auto h-7 w-[200px] rounded-lg pl-2.5"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Select document" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
            {data.map((doc,index) => {
            //   const config = chartConfig[key]

            //   if (!config) {
            //     return null
            //   }

              return (
                <SelectItem
                  key={index}
                  value={doc.title}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: (data.length%10 === 1 && index === data.length - 1 ) ? `hsl(var(--chart-${index%10 + 2}))`  :`hsl(var(--chart-${index%10 + 1}))`,
                      }}
                    />
                    {doc.title}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="consultationNumber"
              nameKey="title"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.consultationNumber.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Consultations
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  )
}
