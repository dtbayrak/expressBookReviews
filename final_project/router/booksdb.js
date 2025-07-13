/**
 * Contains the the preloaded book information for this application.
 */
/**
 * Unicode Character “á” (U+00E1)
 * Unicode Character “é” (U+00E9)
 * Unicode Character “è” (U+00E8) 
 * */
let books = {
      1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": 
            [
                  {
                        "uname" : "user1",
                        "ureview" : "user1's review"
                  },
                  {
                        "uname" : "user2",
                        "ureview" : "user2's review"
                  }
            ]
      },
      2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
      3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
      4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
      5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
      6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
      7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
      8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
      9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
      10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

module.exports=books;
