import { Button } from "./Auth-Button";
import { HOME_DOMAIN, constructMetadata } from "~/utils";
import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const metadata = constructMetadata({
  title: `Create your ${process.env.NEXT_PUBLIC_APP_NAME} account`,
});



export default function RegisterPage() {
  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3">
      <div className="col-span-1 flex items-center justify-center md:col-span-2">
        <div className="w-full max-w-md overflow-hidden border-y border-gray-200 sm:rounded-2xl sm:border sm:shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <a href={HOME_DOMAIN}>{/* <Logo className="h-10 w-10" /> */}</a>
            <h3 className="text-xl font-semibold">
              Create your {process.env.NEXT_PUBLIC_APP_NAME} account
            </h3>
            <p className="text-sm text-gray-500">
              Get started for free. No credit card required.
            </p>
          </div>
          <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
            <Suspense
              fallback={
                <>
                  <Button disabled={true} text="" variant="secondary" />
                  <div className="mx-auto h-5 w-3/4 rounded-lg bg-gray-100" />
                </>
              }
            >
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
     
    </div>
  );
}
