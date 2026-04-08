import * as z from "zod";

export const formSchema = z.object({
	item: z.string().min(1, "Item is required"),
	amount: z.number().positive("Amount must be positive"),
	category: z.string().nonempty("Category is required"),
	date: z.date({
		required_error: "Date is required.",
	}),
});
