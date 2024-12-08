'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { register, FormState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const initialState: FormState = {}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  )
}

export function SignUpButton() {
  const router = useRouter()
  const [state, formAction] = useFormState(register, initialState)

  if (state?.error) {
    toast.error(state.error)
  }

  if (state?.success) {
    toast.success(state.success)
    router.push('/auth/verify')
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <SubmitButton />
    </form>
  )
}