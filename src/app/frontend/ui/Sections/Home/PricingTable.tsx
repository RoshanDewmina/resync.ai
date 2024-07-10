import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const data = [
    { amount: 2500 , price: 19 },
    { amount: 7000, price: 49 },
    { amount: 15000, price: 99 },
    { amount: 40000, price: 249 },
    { amount: 80000, price: 499 },
    { amount: 170000, price: 999 },
    { amount: 350000, price: 1999 },
    { amount: 900000, price: 4999 },
  ]
  
  export function DataTable() {
    return (
      <Table className="ring-1 ring-slate-200 shadow-inner rounded-xl">
        {/* <TableCaption>A list of prices based on amount.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-primary font-bold bg-grey">Amount</TableHead>
            <TableHead className="text-right text-primary font-bold">Price</TableHead>
            <TableHead className="text-right text-primary font-bold">Normal Search</TableHead>
            <TableHead className="text-right text-primary font-bold">Advanced Search</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.amount} Tokens</TableCell>
              <TableCell className="text-right">${item.price}</TableCell>
              <TableCell className="text-right">{(item.amount / 15).toFixed(0)} Questions</TableCell>
              <TableCell className="text-right">{(item.amount / 40).toFixed(0)} Questions</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  