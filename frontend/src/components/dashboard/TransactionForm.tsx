"use client";

import CategorySelect from "@/components/dashboard/forms/CategorySelect";
import DatePicker from "@/components/dashboard/forms/DatePicker";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTransaction } from "@/lib/actions";
import { formSchema } from "@/schemas/formSchema";
import { Category } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface TransactionFormProps {
	data: Category[];
}

const TransactionForm = ({ data: categories }: TransactionFormProps) => {
	// console.log(`Form rendered at: ${new Date().toLocaleTimeString()}`);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			item: "",
			amount: "",
			category: "1",
			date: new Date(),
		},
	});

	const handleSubmit = async (data: {
		item: string;
		category: string;
		amount: string;
		date: Date;
	}) => {
		setLoading(true);
		const { error } = await createTransaction({
			input: {
				item: data.item,
				categoryID: data.category,
				isIncome: false,
				date: format(data.date, "yyyy-MM-dd"),
				amount: Number(data.amount),
			},
		});
		setLoading(false);
		setError(error);
		form.reset();
	};

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
					<Button type="submit" disabled={loading}>
						{loading ? "Submitting..." : "Add Transaction"}
					</Button>
					{error && (
						<p className="text-red-500">{`Submission error: ${error}`}</p>
					)}
				</form>
			</Form>
		</div>
	);
};

export default TransactionForm;
