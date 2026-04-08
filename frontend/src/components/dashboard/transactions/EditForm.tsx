import CategorySelect from "@/components/dashboard/forms/CategorySelect";
import DatePicker from "@/components/dashboard/forms/DatePicker";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/schemas/formSchema";
import { Category } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";

interface EditFormProps {
	id: number;
	item: string;
	amount: number;
	category: {
		id: number;
		name: string;
	};
	date: string;
	handleSubmit: (data: {
		item: string;
		amount: number;
		category: string;
		date: Date;
	}) => Promise<void>;
	categories: Category[];
}

const EditForm = ({
	item,
	amount,
	category,
	date,
	handleSubmit,
	categories,
	children,
}: EditFormProps & PropsWithChildren) => {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			item: item,
			amount: amount,
			category: category.id.toString(),
			date: new Date(date),
		},
	});

	return (
		<div className="h-full overflow-auto p-0.5 pr-2">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="flex h-full flex-col gap-2"
				>
					<FormField
						name="item"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Item" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="amount"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Amount"
										type="number"
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="category"
						control={form.control}
						render={({ field }) => (
							<CategorySelect field={field} categories={categories} />
						)}
					/>

					<FormField
						name="date"
						control={form.control}
						render={({ field }) => <DatePicker field={field} />}
					/>

					<div className="flex-grow" />

					{children}
				</form>
			</Form>
		</div>
	);
};

export default EditForm;
