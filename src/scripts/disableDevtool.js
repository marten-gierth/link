import DisableDevtool from 'disable-devtool';
if (import.meta.env.MODE === 'production') {
    DisableDevtool();
}
else {
    console.log('Devtool is enabled in development mode.');
}