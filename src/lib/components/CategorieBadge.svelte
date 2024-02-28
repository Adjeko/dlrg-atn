<script lang="ts">
  export let category : string;
  let colorString : string;

  if(category == "Online") {
    colorString = "bg-green-50 text-green-600 ring-green-500/10" 
  }
  else if (category == "Tagung"){
    colorString = "bg-indigo-50 text-indigo-600 ring-indigo-500/10"
  }
  else if (category == "Training"){
    colorString = "bg-red-50 text-red-600 ring-red-500/10"
  }
  else if (category == "Fortbildung"){
    colorString = "bg-purple-50 text-purple-600 ring-purple-500/10"
  }
  else if (category == "Ausbildung"){
    colorString = "bg-yellow-50 text-yellow-600 ring-yellow-500/10"
  }
  
</script>


<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {colorString}">
  {category}
</span>