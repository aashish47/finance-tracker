import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Home = async () => {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect("/login");
	} else {
		redirect("/home");
	}
};

export default Home;
