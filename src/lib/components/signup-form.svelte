<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import type { HTMLAttributes } from "svelte/elements";
	
	import { enhance } from "$app/forms";
	import { cn } from "$lib/utils.js";
	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	const id = $props.id();
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
	<Card.Root class="overflow-hidden p-0">
		<Card.Content class="grid p-0 md:grid-cols-2">
			<form method="POST" class={cn("flex flex-col gap-6 p-4")} use:enhance>
				<Field.Group>
					<div class="flex flex-col items-center gap-1 text-center">
						<h1 class="text-2xl font-bold">Crea il tuo account</h1>
					</div>
					<Field.Field>
						<Field.Label for="name-{id}">Username</Field.Label>
						<Input id="name-{id}" name="username" type="text" placeholder="John Doe" required />
					</Field.Field>
					<Field.Field>
						<Field.Label for="email-{id}">Email</Field.Label>
						<Input id="email-{id}" name="email" type="email" placeholder="m@example.com" required />
						<Field.Description>
							Userai l'email solo per fare l'accesso
						</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Label for="password-{id}">Password</Field.Label>
						<Input id="password=-{id}" name="password" type="password" required />
						<Field.Description>Deve essere almeno di 8 caratteri.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Button type="submit">Crea l'account</Button>
					</Field.Field>
					<Field.Field>
						<Field.Description class="px-6 text-center">
							Hai gia un account? <a href="/login">Accedi!</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
			<div class="relative hidden bg-muted md:block">
				<img
					src="/placeholder.svg"
					alt="placeholder"
					class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</Card.Content>
	</Card.Root>
	<Field.Description class="px-6 text-center">
		By clicking continue, you agree to our <a href="##">Terms of Service</a> and
		<a href="##">Privacy Policy</a>.
	</Field.Description>
</div>
