<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import NavUser from "./nav-user.svelte";
  
  import HouseIcon from "@lucide/svelte/icons/house";
  import Archive from "@lucide/svelte/icons/folder-archive";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  
  import { CalendarDate } from "@internationalized/date";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { getCompleteAuth } from "$lib";

  let auth = getCompleteAuth();
  let sessionStore = auth.isValidPocket ? auth.betterAuth() : null;
  let session = sessionStore ? sessionStore.useSession() : null;

  let date = new Date();
  let value = $state<CalendarDate>(new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));

  const items = {
    content: [
      {
        title: "Home",
        url: "/dashboard",
        icon: HouseIcon,
      },
      {
        title: "Raccolte",
        url: "/dashboard/raccolte",
        icon: Archive,
      },
    ], 
    footer: {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    }
  };
</script>
 
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Gestione documenti</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items.content as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton size="lg">
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <Sidebar.Group>
      <Sidebar.GroupLabel>Calendario</Sidebar.GroupLabel>
      <Sidebar.GroupContent class="p-3">
        <Calendar
          type="single"
          bind:value
          locale="it"
          class="rounded-lg shadow-sm"
          numberOfMonths={1}
        />
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <Sidebar.Group>
      <Sidebar.GroupLabel>Preferiti</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <!-- Menu preferiti -->
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    {#if $session && $session?.data}
      <NavUser 
        user={{ 
          email: $session.data.user.email, 
          name: $session.data.user.name, 
          avatar: $session.data.user.image || "" 
        }} 
      />
    {/if}
  </Sidebar.Footer>
</Sidebar.Root>