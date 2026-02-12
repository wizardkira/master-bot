<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 class="text-xl font-bold tracking-tight">Master Bot</h1>
        <nav class="flex gap-2">
          <RouterLink to="/" class="rounded px-3 py-2 text-sm hover:bg-slate-800">Dashboard</RouterLink>
          <RouterLink to="/settings" class="rounded px-3 py-2 text-sm hover:bg-slate-800">Settings</RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
