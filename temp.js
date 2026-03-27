fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyC-y1slvOiFTcKUgrPpWE4UC_fbj20Jg3g')
  .then(r => r.json())
  .then(d => {
    if (d.models) {
      console.log(d.models.map(m => m.name).filter(n => n.includes('gemini')));
    } else {
      console.log('Error:', d);
    }
  })
  .catch(console.error);
