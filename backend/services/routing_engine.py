import networkx as nx
from schemas.route import RouteRequest, RouteResponse

class RoutingEngine:
    def __init__(self):
        # Build a dummy graph
        self.graph = nx.Graph()
        
        # Add edges (NodeA, NodeB, distance/cost)
        edges = [
            ("New York", "Philadelphia", 95),
            ("Philadelphia", "Baltimore", 100),
            ("Baltimore", "Washington", 40),
            ("New York", "Washington", 230),
            ("Washington", "Richmond", 110),
            ("Richmond", "Charlotte", 290),
            ("Charlotte", "Atlanta", 240),
            ("New York", "Chicago", 790),
            ("Chicago", "Atlanta", 715),
        ]
        
        for edge in edges:
            self.graph.add_edge(edge[0], edge[1], weight=edge[2])

    def get_optimal_route(self, request: RouteRequest) -> RouteResponse:
        try:
            path = nx.dijkstra_path(self.graph, request.source, request.destination)
            length = nx.dijkstra_path_length(self.graph, request.source, request.destination)
            
            # Assume average speed of 60 mph for estimated time
            estimated_time = length / 60.0
            
            return RouteResponse(
                path=path,
                total_distance=length,
                estimated_time=estimated_time
            )
        except (nx.NodeNotFound, nx.NetworkXNoPath) as e:
            raise ValueError(f"Route not found: {str(e)}")

routing_engine = RoutingEngine()
