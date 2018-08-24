<script>
    console.log('App.vue');

    console.log('import LazyDependecy1.vue', import('./LazyDependency1.vue'));
    console.log('import LazyDependecy2.vue', import('./LazyDependency2WorkaroundImportfile'));

    export default {};
</script>