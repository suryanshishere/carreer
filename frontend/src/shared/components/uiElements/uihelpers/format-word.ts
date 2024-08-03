export function formatWord(word: string): string {
    if (word.includes("-") || word.includes("__")) {
       const lastIndex = Math.max(word.lastIndexOf("-"), word.lastIndexOf("__"));
       let newformattedWord = word.slice(lastIndex + 1).charAt(0).toUpperCase() + word.slice(lastIndex + 1).slice(1);
       let formattedWord = newformattedWord.charAt(0).toUpperCase() + newformattedWord.slice(1);
       formattedWord = formattedWord.replace(/_/g, ' ');
       return formattedWord; 
   } else {
       let formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
       formattedWord = formattedWord.replace(/_/g, ' ');
       return formattedWord;
   }
 }
 

//not completely tranform to original back, as the whole word can second part of the after "__" related to above.
export function unformatWord(formattedWord: string): string {
    if (formattedWord.includes(" ")) {
        let originalWord = formattedWord.replace(/ /g, '_');
        return originalWord.toLowerCase();
    } else {
        let originalWord = formattedWord.charAt(0).toLowerCase() + formattedWord.slice(1);
        return originalWord.replace(/ /g, '_');
    }
}
