function convertFileSizeToGB(sizeText) {
  const sizeMatch = sizeText.match(/^([\d.]+) (GB|Bytes|KB|MB)$/);
  if (sizeMatch && sizeMatch.length === 3) {
      const size = parseFloat(sizeMatch[1]);
      const unit = sizeMatch[2];
      if (unit === 'Bytes') {
          return size / 1024 / 1024 / 1024;
      } else if (unit === 'KB') {
          return size / 1024 / 1024;
      } else if (unit === 'MB') {
          return size / 1024;
      } else if (unit === 'GB') {
          return size;
      }
  }
  return 0;
}

function calculateTotalBinFileSizeInGB(html, fil_ext) {
  const binFileRegex = new RegExp(`\\.${fil_ext}\\?download=true">([\\d.]+) (GB|Bytes|KB|MB)`, 'g');

  let totalSizeInGB = 0;
  let match;
  while ((match = binFileRegex.exec(html)) !== null) {
      totalSizeInGB += convertFileSizeToGB(`${match[1]} ${match[2]}`);
  }
  return totalSizeInGB;
}
async function clickLoadMoreButton() {
    // Select the "Load More" button using its class name with colons escaped
    const loadMoreButton = document.querySelector('.flex.flex-grow.items-center.justify-center.group-hover\\:underline');
  
    if (loadMoreButton) {
      // Trigger a click event on the button
      loadMoreButton.click();
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
      await clickLoadMoreButton(); // Click again after waiting
    } 
    // else {
    // //   // console.log("No more 'Load More' buttons found.");
    // }
  }
  
  async function main() {
    const selector = '.mr-4.flex.min-w-0.basis-auto.flex-wrap.items-center.md\\:flex-grow.md\\:basis-full.lg\\:basis-auto.lg\\:flex-nowrap';
    if (document.querySelector(selector)) {
      await clickLoadMoreButton(); // Click "Load More" buttons sequentially
  
      // Extract file sizes
      const bin_size = calculateTotalBinFileSizeInGB(document.documentElement.innerHTML, 'bin').toFixed(2);
      const safetensors_size = calculateTotalBinFileSizeInGB(document.documentElement.innerHTML, 'safetensors').toFixed(2);
      const pth_size = calculateTotalBinFileSizeInGB(document.documentElement.innerHTML, 'pth').toFixed(2);
      const pt_size = calculateTotalBinFileSizeInGB(document.documentElement.innerHTML, 'pt').toFixed(2);

      // Create an array of file size strings
      const fileSizes = [
        bin_size > 0 && `.bin size: ${bin_size} GB`,
        pt_size > 0 && `.pt size: ${pt_size} GB`,
        safetensors_size > 0 && `.safetensors size: ${safetensors_size} GB`,
        pth_size > 0 && `.pth size: ${pth_size} GB`,
      ].filter(Boolean); // Filter out falsy values

      // Create the output string
      const outputString = fileSizes.join(' | ');
  
      const message = `<div id="size" class="mb-2 flex items-center overflow-hidden mt-0.5 ml-1.5 rounded border border-yellow-200 bg-yellow-50 px-1 text-xs font-semibold uppercase text-yellow-500 dark:bg-yellow-800 dark:text-yellow-400" style="color: #f59e0b;">Weight file size is: ${outputString}</div>`;
  
      const existingSizeDiv = document.querySelector('#size');
      const divElement = document.querySelector(selector);
  
      if (existingSizeDiv) {
        // If the element with id "size" already exists, replace it
        existingSizeDiv.outerHTML = message;
      } else {
        // If the element doesn't exist, append the new element
        divElement.innerHTML += message;
      }
    } else {
        //DO Nothing
    }
  }
  
  main(); // Start the main function
  