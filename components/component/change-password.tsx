/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/x53aRvMXjVi
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ChangePassword() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Set your password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" required type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" required type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save password</Button>
      </CardFooter>
    </Card>
  )
}
