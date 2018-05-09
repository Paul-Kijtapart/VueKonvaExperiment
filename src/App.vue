<template>
    <div id="app">
        <img src="./assets/logo.png">
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

        <!-- Editor -->
        <editor>
        </editor>

    </div>
</template>

<script>
    // components
    import HelloWorld from './components/HelloWorld.vue'
    import Dashboard from './components/Dashboard';
    import Editor from "./components/Editor";

    export default {
        name: 'app',
        components: {
            Editor,
            Dashboard,
            HelloWorld
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
