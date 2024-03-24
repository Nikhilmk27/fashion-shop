 $(document).ready(function() {
        // Fetch cart count when the page loads
        fetchCartCount();

        // Function to fetch cart count
        function fetchCartCount() {
            $.ajax({
                url: '/cart/count', // Your API endpoint to get cart count
                method: 'GET',
                success: function(response) {
                    // Update the cart count in the navbar
                    $('#cartItemCount').text(response.count);
                },
                error: function(err) {
                    console.log('Error fetching cart count:', err);
                }
            });
        }
    });


    
    

      $(document).ready(function () {
        $('#searchForm').submit(function (event) {
          event.preventDefault();
          const query = $('#searchInput').val().trim();
    
          // Make an AJAX request to the backend API to search for products
          $.ajax({
            url: `/search?query=${query}`,
            method: 'GET',
            success: function (response) {
              // Render search results on the page
              const searchResultsContainer = $('#searchResults');
              // const searchMessage = $('#searchMessage');
              searchResultsContainer.empty();
              console.log(response)
              if (response.length > 0) {
                response.forEach((product) => {
                searchResultsContainer.append(`
                 
                  <div class="col-md-4 mb-4">
              <div class="card">
                <a href="/getProductView/${product._id}"> <!-- Wrap image inside anchor tag -->
                      <img src="/admin/products/${product.image}" class="card-img-top" alt="Product Image">
                  </a>    
                  <div class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <a href="/getProductView/${ product._id}" class="btn btn-primary">View Product</a> <!-- Link to product view page -->
                  </div>
              </div>
          </div>

                `);
              });
              searchResultsContainer.show();
             // Hide search message
            $('#searchMessage').hide();
            
                
              } else {
                searchResultsContainer.hide();
                // Show 'No products available' message
            $('#searchMessage').show();
                
              }

            },
            error: function (err) {
              console.error('Error searching for products:', err);
            },
          });
        });
      });
  