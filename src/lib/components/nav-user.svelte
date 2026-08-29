<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import LogOutIcon from "@lucide/svelte/icons/log-out";
  import Button from "$lib/components/ui/button/button.svelte";
  import { enhance } from "$app/forms";
  
  let { user }: { user: { name: string; email: string; avatar: string } } = $props();
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton size="lg">
      {#snippet child({ props })}
        <a href={"#"} {...props}>
          <SettingsIcon />
          <span>Settings</span>
        </a>
      {/snippet}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton
      size="lg"
      class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Avatar.Root class="size-8 rounded-lg grayscale">
        <Avatar.Image src={user.avatar} alt={user.name} />
        <Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
      </Avatar.Root>
      <div class="grid flex-1 text-start text-sm leading-tight">
        <span class="truncate font-medium">{user.name}</span>
        <span class="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
      <form method="POST" use:enhance>
        <Button type="submit" size="sm" variant="ghost">
          <LogOutIcon />
        </Button>
      </form>
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>