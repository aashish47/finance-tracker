import { TransactionFormValues } from "@/components/dashboard/TransactionForm";
import { FormControl } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Query } from "@/graphql/generated/graphql";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

// The CategorySelectProps will accept either form type with the "category" field as a key.
type CategorySelectProps<TFormValues extends FieldValues> = {
	field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
	categories: Query["Categories"];
};

const CategorySelect = <TFormValues extends TransactionFormValues>({
	field,
	categories,
}: CategorySelectProps<TFormValues>) => {
	return (
		<Select value={field.value?.toString()} onValueChange={field.onChange}>
			<FormControl>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Category" />
				</SelectTrigger>
			</FormControl>
			<SelectContent position="popper" align="start" className="h-[40vh]">
				{categories?.map(
					(category) =>
						category && (
							<SelectItem key={category.id} value={category.id.toString()}>
								{category.name}
							</SelectItem>
						),
				)}
			</SelectContent>
		</Select>
	);
};

export default CategorySelect;
