"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback} from "usehooks-ts";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/../types/api-response";
import signupSchema from "@/../Schemas/signupSchema";
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);

    console.log(data)
    try {
      const response = await axios.post<apiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<apiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center text-black">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>

          <p className="mb-4">Sign Up to Start your Anonymous Adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      />
                  </FormControl>
                      {isCheckingUsername && <Loader2 className="animate-spin"/>}
                      <p className={`text-sm ${usernameMessage === 'Username is Available' ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
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
                </>: "Sign Up"
              }
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4 text-black">
              <p>
                Already a member?{' '}
                <Link href={'/signin'} className="text-blue-600 hover:text-blue-800">Sign In</Link>
              </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
