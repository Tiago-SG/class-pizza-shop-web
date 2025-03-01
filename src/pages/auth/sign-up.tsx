import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import {Link, useNavigate} from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { registerRestaurant } from '@/api/register-restaurant'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signUPForm = z.object({ 
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

type SignUPForm = z.infer<typeof signUPForm>

export function SignUP() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUPForm>()

  const {mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant
  })

  async function handleSignUP(data: SignUPForm) {
    try {      
      await registerRestaurantFn({
        restaurantName: data.restaurantName,
        managerName: data.managerName,
        email: data.email,
        phone: data.phone,
      })
      
      toast.success('Restaurante cadastrado com sucesso.', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${data.email}`)
        }
      })
    } catch {
      toast.error("Erro ao cadastrar restaurante.")
    }
  }

  return (
    <>
      <Helmet title="Login" />

      <div className="p-8">
        <Button asChild className='absolute right-8 top-8' variant='ghost'>
        <Link to="/sign-up" >
          Novo estabelecimento
        </Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignUP)}>
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input id="restaurantName" type="text" {...register('restaurantName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu Nome</Label>
              <Input id="managerName" type="text" {...register('managerName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Seu celular</Label>
              <Input id="phone" type="tel" {...register('phone')} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Acessar painel
            </Button>

            <p className='px-6 text-center text-sm leading-relaxed text-muted-foreground'>
              Ao continuar, você concorda com os nossos 
              {' '}<a href='' className='underline underline-offset-4'>termos de serviço</a> e <a href='' className='underline underline-offset-4'>politicas de privacidade</a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}