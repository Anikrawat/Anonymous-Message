"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react'
import signinSchema from "@/../Schemas/signinSchema";
import { signIn } from "next-auth/react";

const Signin = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signinSchema>) => {

    setIsSubmitting(true)
    
    const response = await signIn('credentials',{
      redirect:false,
      email:data.identifier,
      password:data.password
    })

    if(response?.error){
      toast({
        title:"Login Failed",
        description:"Invalid Email or Password",
        variant:'destructive'
      }) 
    }

    else if(response?.url){
      router.replace('/dashboard')
    }
    setIsSubmitting(false)


  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center text-black">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>

          <p className="mb-4">Sign in to Start your Anonymous Adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? 
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </>: "Sign In"
              }
            </Button>
          </form>
        </Form>

      </div>
    </div>
  );
};

export default Signin;
