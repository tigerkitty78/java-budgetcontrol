import 'bootstrap/dist/css/bootstrap.min.css';


function SavingPlan() {
  return (
    <div className="App">
     <div class='form' style={{borderRadius:"40PX"}} >
            <div class="card-header" style={{ color:'#FDFFFE', backgroundColor:"#1B5C4A", margin:"0px"}}>
        <h2>Test Payment with PayHere</h2>
        </div>
        <form  method="POST" action="https://sandbox.payhere.lk/pay/checkout" id="payhere-checkout-form">
        

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="first_name" value="Saman" />
          </div>
          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control"type="text" name="last_name" value="Perera" />
</div>
          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="email" value="samanp@gmail.com" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="phone" value="0771234567" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="address" value="No.1, Galle Road" />
          </div>

          <div class="form-group">
          <label htmlFor="currency">Currency:</label>
          <input class="form-control" type="text" name="city" value="Colombo" />
          </div>

          
         
          <input class="form-control" type="hidden" name="country" value="Sri Lanka" />
        

         
         
          <input class="form-control" type="hidden" name="hash" value="F0827056154DCFB4B1BE0BA98BCBE7C9" />    
          

          <input type="submit" value="Buy Now" style={{background:"#1B5C4A"}}/>
        </form>
      </div>
    </div>
  );
}

export default SavingPlan;
