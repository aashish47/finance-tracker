import { TransactionFormValues } from "@/components/dashboard/TransactionForm";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

// Add the `FieldValues` constraint to `TFormValues`
// Path<TFormValues> ensures that the 'date' is a valid key in the form
type DatePickerProps<TFormValues extends FieldValues> = {
	field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
};

// Usage in component (example):
const DatePicker = <TFormValues extends TransactionFormValues>({
	field,
}: DatePickerProps<TFormValues>) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	return (
		<FormItem className="flex flex-col">
			<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
				<PopoverTrigger asChild>
					<FormControl>
						<Button
							variant={"outline"}
							className={cn(
								"bg-transparent pl-3 text-left font-normal",
								!field.value && "text-muted-foreground",
							)}
						>
							{field.value ? format(field.value, "PPP") : <span>Date</span>}
							<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={new Date(field.value)}
						onSelect={(date) => {
							field.onChange(date);
							setIsPopoverOpen(false);
						}}
						disabled={(date) =>
							date > new Date() || date < new Date("1900-01-01")
						}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
			<FormMessage />
		</FormItem>
	);
};

export default DatePicker;
