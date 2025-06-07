module.exports = function(eleventyConfig) {
   eleventyConfig.addPassthroughCopy("src/js");
   eleventyConfig.addPassthroughCopy("src/style");
   eleventyConfig.addPassthroughCopy("src/assets");
   
   return {
     dir: {
       input: "src",
       includes: "includes",
       output: "_site"
     },
     htmlTemplateEngine: "njk"
   };
};