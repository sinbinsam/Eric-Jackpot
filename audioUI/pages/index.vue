<template>
  <div class="container">
    <h1>YO</h1>
    <div
    v-if="jobs"
    >
      <jobEditor 
      v-for="job in jobs"
      v-bind:job="job"
      v-bind:key="job._id"
      />
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import jobEditor from '../components/jobEditor'

export default {
  name: 'AudioUI',
  components: {
    jobEditor
  },
  methods: {
    getJobs() {
      axios.get('http://localhost:9090/api/get')
        .then(res => {
          this.jobs = res.data
        })
    },
    setJobs() {
      axios.get('http://localhost:9090/api/set', {jobs})
    }
  },
  data() {
    return {
      jobs: null
    }
  },
  created() {
    this.getJobs()
  }
}
</script>

<style>

</style>
