import { createClient } from "@/utils/supabase/server";

export const getSession = async () => {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session) {
		throw new Error("Session null");
	}
	return session;
};
