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

function calculateTotalBinFileSizeInGB(html,fil_ext) {
    const binFileRegex = new RegExp(`\\/[^/]+\\.${fil_ext}"\\s*>([\\d.]+ (GB|Bytes|KB|MB))`, 'g');

    let totalSizeInGB = 0;
    let match;
    while ((match = binFileRegex.exec(html)) !== null) {
        totalSizeInGB += convertFileSizeToGB(match[1]);
    }
    return totalSizeInGB;
}
if (document.querySelector('.mr-4.flex.min-w-0.basis-auto.flex-wrap.items-center.md\\:flex-grow.md\\:basis-full.lg\\:basis-auto.lg\\:flex-nowrap')) {
    const html = document.documentElement.innerHTML;
    const bin_size = calculateTotalBinFileSizeInGB(html,'bin').toFixed(2);
    const safetensors_size = calculateTotalBinFileSizeInGB(html,'safetensors').toFixed(2);
    const pth_size    = calculateTotalBinFileSizeInGB(html,'pth').toFixed(2);

    const fileSizes = [];

    if (bin_size > 0) {
        fileSizes.push(`.bin size: ${bin_size}`);
    }
    
    if (safetensors_size > 0) {
        fileSizes.push(`.safetensors size: ${safetensors_size}`);
    }
    
    if (pth_size > 0) {
        fileSizes.push(`.pth size: ${pth_size}`);
    }
    
    const outputString = fileSizes.join(' GB | ');


    const message = `<div> <div><div id="size" class="mb-2 flex items-center overflow-hidden mt-0.5 ml-1.5 rounded border border-yellow-200 bg-yellow-50 px-1 text-xs font-semibold uppercase text-yellow-500 dark:bg-yellow-800 dark:text-yellow-400" style="color=red">   weight file size is : ${outputString} GB </div>`;
    const divElement = document.querySelector('.mr-4.flex.min-w-0.basis-auto.flex-wrap.items-center.md\\:flex-grow.md\\:basis-full.lg\\:basis-auto.lg\\:flex-nowrap');

        divElement.innerHTML += message;
}
