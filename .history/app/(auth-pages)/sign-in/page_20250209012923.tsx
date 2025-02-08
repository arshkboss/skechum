
import GoogleSignin from "./google-sign-in";
import NotionSignin from "./notion-sign-in";

export default async function Login() {
  
  
  return (
    <div className="flex flex-col min-w-64 max-w-4xl mx-auto justify-center">
      
        <h1 className="text-2xl font-medium">Sign in</h1>
        
        
        <div className="flex flex-col  justify-center py-8 border-b-2 border-gray-200">
          <GoogleSignin />
        </div>
       
        <div className="flex flex-col  justify-center py-8 border-b-2 border-gray-200">
          <NotionSignin />
        </div>
      
    </div>
  );
}
