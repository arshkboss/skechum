
import GoogleSignin from "./google-sign-in";
 import FigmaSignin from "./figma-sign-in";

export default async function Login() {
  
  
  return (
    <div className="flex flex-col min-w-64 max-w-4xl mx-auto justify-center px-8 outline outline-gray-200 rounded-lg pt-4">
      
        <h1 className="text-2xl font-medium">Sign in</h1>
        
        
        <div className="flex flex-col  justify-center py-8 border-b-2 border-gray-200">
          <GoogleSignin />
        </div>
       
        <div className="flex flex-col  justify-center py-8 ">
          <FigmaSignin />
        </div>
      
    </div>
  );
}
