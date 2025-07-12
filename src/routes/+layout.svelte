<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<ModeWatcher />
<div class="flex justify-center p-2 py-[10vh]">
	{@render children()}
</div>
