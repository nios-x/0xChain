from sqlalchemy import Column, Integer, String, Float
from models.base import Base

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    nodes = Column(String, nullable=False) # JSON list of nodes
    distance = Column(Float, nullable=False)
    estimated_time = Column(Float, nullable=False)
