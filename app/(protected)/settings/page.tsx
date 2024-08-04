import {auth, signOut} from "@/auth";
import {Button} from "@/components/ui/button";

const Page = async () => {
    const session = await auth()
    return (
        <div>
            {
                JSON.stringify(session)
            }
            {/* sign out function*/}
            <form
                className="mt-4 flex justify-start "
                action={async ()=>{
                "use server"
                await signOut()
            }}>
                <Button type={"submit"}>sign out</Button>
            </form>

        </div>
    );
};

export default Page;