"use client"
import React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "./dateRange"
import { toast } from "sonner"
import { DataTablePagination } from "./dataTablePagination"
export function DataTable({
  columns,
  data,
  creationDate,
  setCreationDate,
  consultaionDate,
  setConsultationDate,
  nbrColumnsMax,
  type,
}) {
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] =
  React.useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  })

  React.useEffect(() => {
    table.getAllColumns().forEach((column,index) => {
      if(index > (nbrColumnsMax - 1)){
        column.toggleVisibility(false)
      }
    })
  },[])

  return (
    <div className="col-span-3" >
      <div className="flex items-center pb-4 gap-2">
        {(type === 'dashboard' || type === 'document' || type === 'error') &&table.getColumn('title')?.getIsVisible() && <Input
          placeholder="Filter documents..."
          value={(table.getColumn("title")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />}
        {(type === 'project' || type === 'source')&& table.getColumn('name')?.getIsVisible() && <Input
          placeholder="Filter par nom..."
          value={(table.getColumn("name")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />}
        {type === 'dashboard' && table.getColumn('createdAt')?.getIsVisible() && 
        <DatePickerWithRange date={creationDate} setDate={setCreationDate} placeholder={"Date création"}/>
        }
        {type === 'dashboard' && table.getColumn('consultationNumber')?.getIsVisible() && 
        <Input
          placeholder="Nombre à partir de..."
          value={(table.getColumn("consultationNumber")?.getFilterValue()) ?? ""}
          onChange={(event) =>
           parseInt(event.target.value) ?
            table.getColumn("consultationNumber")?.setFilterValue(parseInt(event.target.value).toString())
            : table.getColumn("consultationNumber")?.setFilterValue("")
          }
          className="max-w-sm"
        />
        }
        {type === 'dashboard' && table.getColumn('lastConsultation')?.getIsVisible() && 
        <DatePickerWithRange date={consultaionDate} setDate={setConsultationDate} placeholder={'Date consultation'}/>
        }
        {type === 'historic' && table.getColumn('date')?.getIsVisible() && 
        <DatePickerWithRange date={consultaionDate} setDate={setConsultationDate} placeholder={'Date consultation'}/>
        }
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      if(value){
                        if (table.getVisibleLeafColumns().length > (nbrColumnsMax-1)) {
                          toast.error(`Vous ne pouvez pas afficher plus de ${nbrColumnsMax} colonnes`)
                        }else{
                          column.toggleVisibility(!!value)
                        }
                      }else{
                      column.toggleVisibility(!!value)
                      }
                    }
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border" style={{boxShadow: "0 0 4px 2px rgb(0,0,0,0.1)"}}>
        <Table>
          <TableHeader className='bg-gray-100'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3">
        <DataTablePagination table={table}/>
      </div>
    </div>      
  )
}
