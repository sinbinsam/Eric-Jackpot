<template>
    <div>
        <p>{{job.fileName}}</p>

        <b-form-input
          v-model="job.fileName"
          required
          placeholder="Enter file name"
        ></b-form-input>        
        <b-form-input
          v-model="job.cron"
          required
          placeholder="Enter cron"
        ></b-form-input>

        <b-form-input
          v-model="job.timeLength"
          required
          placeholder="Enter time in milliseconds"
        ></b-form-input>
    </div>
</template>

<script>
export default {
    props: [
        'job'
    ],
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>

</style>