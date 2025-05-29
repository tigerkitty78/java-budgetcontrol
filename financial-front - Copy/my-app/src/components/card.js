import 'bootstrap/dist/css/bootstrap.min.css';
import Linegraph from './linegraph';


function Card({category} ) {
  return (

  <div class="card" style={{width: '11rem', height: '12rem', background:'#DDF0E4'}}>
  
  <div class="card-body">
  <div class="card-header" style={{background:'#1B5C4A', color:'#FDFFFE'}}>
  <p >{category} </p>
  </div>
 
  
   
  </div>
  <div className="card-body">
              {/* <h5 className="card-title">{category} Expenses</h5> */}
                <Linegraph category={category} />
            </div>
</div>

  );
}

export default Card;