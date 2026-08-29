<script lang="ts">
	import LoginForm from "$lib/components/login-form.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
	import { toast } from "svelte-sonner";

	let { form } = $props();
	$effect(() => {
		if (form && form.errors) {
			switch (typeof form.errors) {
				case "string":
					toast.error(form.errors)
					break;
				default:
					Object.values(form.errors).forEach(error => {
						toast.error(error.errors.join(", "))
					})
					break;
			}
		}
	})

</script>

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-3xl">
		<LoginForm />
	</div>
</div>
<Toaster />