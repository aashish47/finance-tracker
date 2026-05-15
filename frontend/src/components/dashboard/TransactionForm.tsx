"use client";

import FormButton from "@/components/dashboard/form/FormButton";
import FormContent from "@/components/dashboard/form/FormContent";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Query, Transaction } from "@/graphql/generated/graphql";
import { createTransaction } from "@/lib/actions/transaction-actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { toast } from "sonner";
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

interface TransactionFormProps extends PropsWithChildren {
	categories: Query["Categories"];
	mode?: "create" | "edit";
	transaction?: Transaction;
	onSubmit?: (data: TransactionFormValues) => Promise<void>;
	submitButtonLabel?: string;
	showWrapper?: boolean;
}

export type TransactionFormValues = z.input<typeof formSchema>;

const TransactionForm: React.FC<TransactionFormProps> = ({
	categories,
	mode = "create",
	transaction,
	onSubmit: customOnSubmit,
	submitButtonLabel,
	showWrapper = true,
	children,
}) => {
	const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
	const [formData, setFormData] = useState<TransactionFormValues>(
		mode === "edit" && transaction
			? {
					item: transaction.item,
					amount: transaction.amount,
					categoryID: transaction.category.id.toString(),
					date: new Date(transaction.date),
				}
			: {
					item: "",
					amount: "",
					categoryID: "1",
					date: new Date(),
				},
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate with zod schema
		const result = formSchema.safeParse(formData);

		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((error) => {
				const path = error.path[0] as string;
				fieldErrors[path] = error.message;
			});
			setErrors(fieldErrors);
			return;
		}

		// Clear errors on success
		setErrors({});

		// Submit
		if (mode === "edit" && customOnSubmit) {
			await customOnSubmit(result.data);
			toast.success("Transaction updated successfully", {
				description: format(new Date(), "PPPPpp"),
			});
		} else {
			await createTransaction({
				input: {
					item: result.data.item,
					categoryID: result.data.categoryID,
					isIncome: false,
					date: format(result.data.date, "yyyy-MM-dd"),
					amount: Number(result.data.amount),
				},
			});
			toast.success("Transaction created successfully", {
				description: format(new Date(), "PPPPpp"),
			});
			// Reset form on successful create
			setFormData({
				item: "",
				amount: "",
				categoryID: "1",
				date: new Date(),
			});
		}
	};

	const formContent = (
		<form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
			<FormContent>
				<FieldGroup className="gap-2">
					{/* Item Field */}
					<Field data-invalid={!!errors.item}>
						{/* <FieldLabel htmlFor="item">Item</FieldLabel> */}
						<Input
							id="item"
							placeholder="Item"
							value={formData.item}
							onChange={(e) =>
								setFormData({ ...formData, item: e.target.value })
							}
							aria-invalid={!!errors.item}
						/>
						{errors.item && <FieldDescription>{errors.item}</FieldDescription>}
					</Field>

					{/* Amount Field */}
					<Field data-invalid={!!errors.amount}>
						{/* <FieldLabel htmlFor="amount">Amount</FieldLabel> */}
						<Input
							id="amount"
							placeholder="Amount"
							type="number"
							value={formData.amount || ""}
							onChange={(e) =>
								setFormData({ ...formData, amount: e.target.value })
							}
							aria-invalid={!!errors.amount}
						/>
						{errors.amount && (
							<FieldDescription>{errors.amount}</FieldDescription>
						)}
					</Field>

					{/* Category Field */}
					<Field data-invalid={!!errors.categoryID}>
						{/* <FieldLabel>Category</FieldLabel> */}
						<Select
							value={formData.categoryID}
							onValueChange={(value) =>
								setFormData({ ...formData, categoryID: value })
							}
						>
							<SelectTrigger
								className="w-full"
								aria-invalid={!!errors.categoryID}
							>
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent
								position="popper"
								align="start"
								className="h-[40vh]"
							>
								{categories?.map(
									(category) =>
										category && (
											<SelectItem
												key={category.id}
												value={category.id.toString()}
											>
												{category.name}
											</SelectItem>
										),
								)}
							</SelectContent>
						</Select>
						{errors.categoryID && (
							<FieldDescription>{errors.categoryID}</FieldDescription>
						)}
					</Field>

					{/* Date Field */}
					<Field data-invalid={!!errors.date}>
						{/* <FieldLabel>Date</FieldLabel> */}
						<Popover
							open={isDatePopoverOpen}
							onOpenChange={setIsDatePopoverOpen}
						>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!formData.date && "text-muted-foreground",
									)}
									aria-invalid={!!errors.date}
								>
									{formData.date ? (
										format(formData.date, "PPP")
									) : (
										<span>Pick a date</span>
									)}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={formData.date}
									onSelect={(date) => {
										if (date) {
											setFormData({ ...formData, date });
											setIsDatePopoverOpen(false);
										}
									}}
									disabled={(date) =>
										date > new Date() || date < new Date("1900-01-01")
									}
									autoFocus
								/>
							</PopoverContent>
						</Popover>
						{errors.date && <FieldDescription>{errors.date}</FieldDescription>}
					</Field>
				</FieldGroup>

				<div className="grow" />
				{children ? (
					children
				) : (
					<FormButton
						formType={mode === "edit" ? "update" : "add"}
						label={submitButtonLabel}
						type="submit"
					/>
				)}
			</FormContent>
		</form>
	);

	return showWrapper ? (
		<div className="h-full overflow-auto p-0.5 pr-2">{formContent}</div>
	) : (
		formContent
	);
};

export default TransactionForm;
