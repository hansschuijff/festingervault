import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { ReactElement, ReactNode } from "react";

type ColumnRenderProps<TData> = {
	row: TData;
	columnId: string;
};
export type SimpleColumnDef<TData> = {
	id: string;
	label: string;
	className?: ClassValue;
	render:
		| string
		| ((props: ColumnRenderProps<TData>) => ReactElement | ReactNode);
};
type Props<TData> = {
	columns: Array<SimpleColumnDef<TData>>;
	data: Array<({ id: string | number } & TData)>;
};
export default function SimpleTable<TData>({ columns, data }: Props<TData>) {
	return (
		<table className="group table-auto">
			<thead>
				<tr className="group/head text-left font-semibold">
					{columns.map(column => (
						<th
							key={column.id}
							className=" group/head-cell border-b px-4 pb-4 text-left first:pl-0 last:pr-0"
						>
							{column.label}
						</th>
					))}
				</tr>
			</thead>
			<tbody className="group/body">
				{data &&
					data?.map(row => (
						<tr className="group/body-row" key={row.id}>
							{columns.map(column => (
								<td
									key={`${column.id}_${row.id}`}
									className={cn(
										"group/body-row-cell border-b p-4 first:pl-0 last:pr-0 group-last/body-row:border-b-0 group-last/body-row:pb-0",
										column.className,
									)}
								>
									{typeof column.render === "function"
										? column.render({ row, columnId: column.id })
										: column.render}
								</td>
							))}
						</tr>
					))}
			</tbody>
		</table>
	);
}
