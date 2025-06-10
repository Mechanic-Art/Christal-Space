module.exports = function(eleventyConfig) {
   eleventyConfig.addPassthroughCopy("src/js");
   eleventyConfig.addPassthroughCopy("src/style");
   eleventyConfig.addPassthroughCopy("src/assets");
   eleventyConfig.addPassthroughCopy("src/.nojekyll");
   eleventyConfig.addPassthroughCopy("src/jeu");
  
   return {
     dir: {
       input: "src",
       includes: "includes",
       output: "docs"
     },
     htmlTemplateEngine: "njk"
   };
};

