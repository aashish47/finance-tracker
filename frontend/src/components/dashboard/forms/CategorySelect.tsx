import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

// Define a type for the two possible forms
type FormWithAmountAsNumber = {
	item: string;
	amount: number;
	category: string;
	date: Date;
};

type FormWithAmountAsString = {
	item: string;
	amount: string;
	category: string;
	date: Date;
};

// The CategorySelectProps will accept either form type with the "category" field as a key.
type CategorySelectProps<TFormValues extends FieldValues> = {
	field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
	categories: { id: number; name: string }[];
};

const CategorySelect = <
	TFormValues extends FormWithAmountAsNumber | FormWithAmountAsString,
>({
	field,
	categories,
}: CategorySelectProps<TFormValues>) => {
	return (
		<FormItem>
			<Select value={field.value?.toString()} onValueChange={field.onChange}>
				<FormControl>
					<SelectTrigger>
						<SelectValue placeholder="Category" />
					</SelectTrigger>
				</FormControl>
				<SelectContent className="h-[40vh]">
					{categories.map((category) => (
						<SelectItem key={category.id} value={category.id.toString()}>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FormMessage />
		</FormItem>
	);
};

export default CategorySelect;
