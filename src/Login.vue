<script setup lang="ts">
    defineProps <{
        email:null | string
    }>();
     
    </script>
       
    <template>
      <h1 v-if="email"><a href='http://localhost:9000/logout'>log Out</a></h1>
      <h1 v-else><a href='http://localhost:9000/login'>log In</a></h1>
    </template>
    
    <style scoped>
    </style>