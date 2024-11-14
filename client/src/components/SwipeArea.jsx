import TinderCard from 'react-tinder-card';
import { useMatchStore } from '../store/useMatchStore';


const SwipeArea = () => {

  const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user)
    else if (dir === "left") swipeLeft(user)
    
  }

  return (
    <div className='relative w-full max-w-xs h-[28rem] '>
      {userProfiles.map(user => (
        <TinderCard className='absolute w-full shadow-none'
          key={user._id}
          onSwipe={(dir) => handleSwipe(dir, user)}
          swipeRequirementType='position'
          swipeThreshold={100}
          preventSwipe={["up", "down"]}
        >
          <img
            src={user.image || "/avatar.png"}
            alt={user.name}
            className='rounded-xl h-[28rem] w-full object-cover pointer-events-none '
          />
          <div className='rounded-xl bottom-0 p-4 text-white backdrop-blur-sm bg-transparent bg-opacity-30 w-full absolute'>
              <h2 className='card-title text-2xl'>
                {user.name}, {user.age}
              </h2>
              <p className=''>{user.bio}</p>
            </div>
        </TinderCard>
      ))}
    </div>
  )
}

export default SwipeArea