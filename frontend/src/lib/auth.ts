import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const getSession = async () => {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session) {
		redirect("/login");
	}
	return session;
};

export const getUser = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/login");
	}
	return user;
};
