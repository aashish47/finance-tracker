"use client";

import CategorySelect from "@/components/dashboard/form/CategorySelect";
import DatePicker from "@/components/dashboard/form/DatePicker";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Query } from "@/graphql/generated/graphql";
import { createTransaction } from "@/lib/actions/transaction-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
	item: z.string().min(1, "Item is required"),
	amount: z
		.union([z.number(), z.string()])
		.transform((val) => (val === "" ? undefined : Number(val)))
		.pipe(z.number().positive("Amount must be positive")),
	categoryID: z.string().nonempty("Category is required"),
	date: z.date(),
});

interface TransactionFormProps {
	categories: Query["Categories"];
}

export type TransactionFormValues = z.input<typeof formSchema>;

const TransactionForm: React.FC<TransactionFormProps> = ({ categories }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<null | string>(null);

	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			item: "",
			amount: "",
			categoryID: "1",
			date: new Date(),
		},
	});

	const handleSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
		setLoading(true);
		const { error } = await createTransaction({
			input: {
				item: data.item,
				categoryID: data.categoryID,
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
