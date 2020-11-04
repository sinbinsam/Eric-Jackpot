<template>
  <div class="container">
    <h1>YO</h1>

    <b-button
    v-bind:val="this.jackpot"
    ></b-button>

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
      axios.get(this.apiRoute + '/api/get')
        .then(res => {
          this.jobs = res.data
        })
    },
    setJobs() {
      axios.get(this.apiRoute + '/api/set', {jobs})
    },
    getConfigs() {
      axios.get(this.apiRoute + '/config/get')
        .then(res => {
          this.jackpot = res.data.jackpot
        })
        .catch(console.log('error contacting API server'))
    }
  },
  data() {
    return {
      apiRoute: 'http://localhost:9090',
      jobs: null,
      jackpot: null
    }
  },
  created() {
    this.getJobs()
    this.getConfigs()
  }
}
</script>

<style>

</style>
