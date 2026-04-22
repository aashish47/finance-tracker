import CategorySelect from "@/components/dashboard/forms/CategorySelect";
import DatePicker from "@/components/dashboard/forms/DatePicker";
import { formSchema } from "@/components/dashboard/TransactionForm";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Query, Transaction } from "@/graphql/generated/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";

interface EditFormProps {
	transaction: Transaction;
	handleSubmit: (data: {
		item: string;
		amount: number;
		categoryID: string;
		date: Date;
	}) => Promise<void>;
	categories: Query["Categories"];
}

const EditForm = ({
	transaction,
	handleSubmit,
	categories,
	children,
}: EditFormProps & PropsWithChildren) => {
	const { item, amount, category, date } = transaction;
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			item: item,
			amount: amount,
			categoryID: category.id.toString(),
			date: new Date(date),
		},
	});

	return (
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
									{...field}
									placeholder="Amount"
									type="number"
									value={field.value || ""}
									onChange={(e) => {
										const val = e.target.value;
										field.onChange(val === "" ? "" : val);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="categoryID"
					control={form.control}
					render={({ field }) => (
						<FormItem className="space-y-0">
							<CategorySelect field={field} categories={categories} />
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="date"
					control={form.control}
					render={({ field }) => <DatePicker field={field} />}
				/>

				<div className="grow" />

				{children}
			</form>
		</Form>
	);
};

export default EditForm;
