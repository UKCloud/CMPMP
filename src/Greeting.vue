<template>
    
    <div class="greet">
        <h3 v-if="email">Welcome {{email}}</h3>
        <h3 v-else>you are not logged in</h3>
    </div>
</template>

<script setup lang="ts">
    // export default {
    //     name: 'app', 
    //     components: {
    //         Greet,
    //     },
    //     data() {
    //         return {
    //             email: 'default@email.com'
    //         }
    //     }
    //     }
    

    defineProps<{
        email: string;
    }>();

    
</script>

<style></style>

